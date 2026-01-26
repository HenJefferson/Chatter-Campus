<?php

namespace App\Http\Controllers;

use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DirectMessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Get unique users the current user has chatted with
        $conversations = DirectMessage::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->select(DB::raw('CASE WHEN sender_id = ' . $userId . ' THEN receiver_id ELSE sender_id END as contact_id'))
            ->distinct()
            ->get()
            ->pluck('contact_id');

        return User::whereIn('id', $conversations)->get(['id', 'name', 'role', 'faculty', 'department']);
    }

    public function show(Request $request, User $user)
    {
        $currentUserId = $request->user()->id;
        $contactId = $user->id;

        $messages = DirectMessage::where(function ($query) use ($currentUserId, $contactId) {
            $query->where('sender_id', $currentUserId)->where('receiver_id', $contactId);
        })->orWhere(function ($query) use ($currentUserId, $contactId) {
            $query->where('sender_id', $contactId)->where('receiver_id', $currentUserId);
        })->orderBy('created_at', 'asc')->get();

        // Mark as read
        DirectMessage::where('sender_id', $contactId)
            ->where('receiver_id', $currentUserId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        if (!$request->content && !$request->hasFile('file')) {
            return response()->json(['message' => 'Message content or file is required.'], 422);
        }

        $filePath = null;
        $fileType = null;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('uploads/dms', 'public');
            $fileType = $file->getMimeType();
        }

        $message = DirectMessage::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content' => $request->content ?? '',
            'file_path' => $filePath,
            'file_type' => $fileType,
        ]);

        return response()->json($message, 201);
    }
}
