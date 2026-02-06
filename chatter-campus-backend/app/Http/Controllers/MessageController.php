<?php

namespace App\Http\Controllers;
use App\Events\UserTyping;

use App\Models\Message;
use App\Models\Space;
use Illuminate\Http\Request;



class MessageController extends Controller
{
    public function store(Request $request, $spaceId)
    {
        // 1️⃣ Validate request data
        $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:200000', // 200MB max, for consistency with PHP config
        ]);

        if (!$request->content && !$request->hasFile('file')) {
            return response()->json(['message' => 'Message content or file is required.'], 422);
        }

        // 2️⃣ Find the space
        $space = \App\Models\Space::findOrFail($spaceId);

        // 3️⃣ Get authenticated user
        $user = $request->user();

        // 4️⃣ Check space membership
        if (!$space->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Unauthorized. You are not a member of this space.'
            ], 403);
        }

        $filePath = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('uploads/messages', 'public');
            $fileType = $file->getMimeType();
        }

        // 5️⃣ CREATE MESSAGE (DATABASE)
        $message = Message::create([
            'space_id' => $space->id,
            'user_id' => $user->id,
            'content' => $request->content ?? '',
            'file_path' => $filePath,
            'file_type' => $fileType,
        ]);

        // 6️⃣ FIRE REAL-TIME EVENT (WEBSOCKET)
        event(new \App\Events\MessageSent($message));

        // 7️⃣ Return response
        return response()->json($message->load('user'), 201);
    }



    public function index(Request $request, Space $space)
    {
        $user = $request->user();

        // 🔐 Authorization: user must belong to the space
        if (!$space->users()->where('users.id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Unauthorized. You are not a member of this space.'
            ], 403);
        }

        // 👑 Admin sees deleted messages
        if ($user->isAdmin()) {
            $messages = $space->messages()
                ->withTrashed()
                ->with('user:id,name,role')
                ->orderBy('created_at', 'asc')
                ->paginate(20);
        }
        // 👤 Normal users do NOT see deleted messages
        else {
            $messages = $space->messages()
                ->with('user:id,name,role')
                ->orderBy('created_at', 'asc')
                ->paginate(20);
        }

        return response()->json($messages);
    }


    public function destroy(Message $message)
    {
        // Temporarily comment out authorization to isolate issue
        // $this->authorize('delete', $message);

        $message->delete(); // This performs a soft delete

        return response()->json([
            'message' => 'Message deleted successfully',
        ]);
    }


    public function update(Request $request, Message $message)
    {
        $this->authorize('update', $message);

        $request->validate([
            'content' => 'required|string',
        ]);

        $message->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Message updated successfully',
            'data' => $message,
        ]);
    }


    public function restore($id)
    {
        $message = Message::withTrashed()->findOrFail($id);

        $this->authorize('restore', $message);

        $message->restore();

        return response()->json([
            'message' => 'Message restored successfully',
        ]);
    }

    public function forceDestroy(Message $message)
    {
        $this->authorize('forceDelete', $message);

        $message->forceDelete();

        return response()->json([
            'message' => 'Message permanently deleted',
        ]);
    }

    public function typing(Request $request)
    {
        \Log::info('Typing endpoint hit', $request->all());

        $request->validate([
            'space_id' => 'required|exists:spaces,id',
            'typing' => 'required|boolean',
        ]);

        $user = $request->user();
        $space = Space::findOrFail($request->space_id);

        if (!$space->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        broadcast(new UserTyping(
            $user->name,
            $space->id,
            $request->typing
        ))->toOthers();

        return response()->json(['status' => 'typing']);
    }


}

