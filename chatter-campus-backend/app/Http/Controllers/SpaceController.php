<?php

namespace App\Http\Controllers;

use App\Models\Space;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Message;

class SpaceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return Space::all();
        }

        return Space::query()
            ->where(function ($query) use ($user) {
                $query->whereNull('faculty')
                    ->orWhere('faculty', $user->faculty);
            })
            ->where(function ($query) use ($user) {
                $query->whereNull('department')
                    ->orWhere('department', $user->department);
            })
            ->where(function ($query) use ($user) {
                $query->whereNull('level')
                    ->orWhere('level', $user->level);
            })
            ->get();
    }

    public function store(Request $request)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admins only.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'faculty' => 'nullable|string',
            'department' => 'nullable|string',
            'level' => 'nullable|string',
        ]);

        return Space::create($request->only('name', 'description', 'faculty', 'department', 'level'));
    }

    public function show(Space $space)
    {
        return $space;
    }

    public function members(Space $space)
    {
        return $space->users;
    }



    public function addUser(Request $request, Space $space)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admins only.'
            ], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $space->users()->syncWithoutDetaching($request->user_id);

        return response()->json([
            'message' => 'User added to space successfully'
        ]);
    }


    public function join(Request $request, Space $space)
    {
        $user = $request->user();

        // Check access rules
        if ($space->faculty && $space->faculty !== $user->faculty) {
            return response()->json(['message' => 'Unauthorized: This space is restricted to ' . $space->faculty], 403);
        }
        if ($space->department && $space->department !== $user->department) {
            return response()->json(['message' => 'Unauthorized: This space is restricted to ' . $space->department], 403);
        }
        if ($space->level && $space->level !== $user->level) {
            return response()->json(['message' => 'Unauthorized: This space is restricted to level ' . $space->level], 403);
        }

        \Log::info('Join request received', [
            'user_id' => $user->id,
            'space_id' => $space->id
        ]);

        $space->users()->syncWithoutDetaching($user->id);

        return response()->json([
            'message' => 'You have joined the space successfully'
        ]);
    }


    private function isEligible(User $user, Space $space)
    {
        // Admins have access to everything
        if ($user->isAdmin()) {
            return true;
        }

        // General Space (no restrictions)
        if (!$space->faculty && !$space->department && !$space->level) {
            return true;
        }

        // Faculty General Space (faculty matches, no department/level)
        if ($space->faculty === $user->faculty && !$space->department && !$space->level) {
            return true;
        }

        // Department Space (faculty and department match)
        if ($space->faculty === $user->faculty && $space->department === $user->department) {
            // Optional: check level if specified
            if ($space->level && $space->level !== $user->level) {
                return false;
            }
            return true;
        }

        // Fallback: check if explicitly joined
        return $space->users()->where('user_id', $user->id)->exists();
    }

    public function sendMessage(Request $request, Space $space)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $user = auth()->user();

        if (!$this->isEligible($user, $space)) {
            return response()->json(['message' => 'Unauthorized. You are not eligible for this space.'], 403);
        }

        // Auto-join if eligible but not a member
        if (!$space->users()->where('user_id', $user->id)->exists()) {
            $space->users()->syncWithoutDetaching($user->id);
        }

        $message = $space->messages()->create([
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        return response()->json($message);
    }

    public function getMessages(Space $space)
    {
        $user = auth()->user();

        if (!$this->isEligible($user, $space)) {
            return response()->json(['message' => 'Unauthorized. You are not eligible for this space.'], 403);
        }

        return $space->messages()->with('user')->orderBy('created_at', 'asc')->get();
    }


}
