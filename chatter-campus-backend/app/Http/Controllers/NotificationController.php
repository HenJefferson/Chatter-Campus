<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        return $request->user()
            ->notifications()              // User's notifications
            ->orderBy('created_at', 'desc')// Latest first
            ->paginate(20);                // 20 per page
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $notification = auth()->user()
            ->notifications()             // Only THIS user's notifications
            ->where('id', $id)
            ->firstOrFail();              // 404 if not found

        $notification->update([
            'read_at' => now()
        ]);

        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }
}
