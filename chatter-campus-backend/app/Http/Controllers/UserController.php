<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return User::all();
    }

    public function update(Request $request, User $user)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'faculty' => 'nullable|string',
            'department' => 'nullable|string',
            'level' => 'nullable|string',
        ]);

        $user->update($request->only('faculty', 'department', 'level'));

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function show(User $user)
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role,
            'faculty' => $user->faculty,
            'department' => $user->department,
            'level' => $user->level,
            'created_at' => $user->created_at,
        ]);
    }
}
