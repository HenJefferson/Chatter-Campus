<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Can user update (edit) a message?
     */
    public function update(User $user, Message $message)
    {
        // Admin can edit any message
        if ($user->isAdmin()) {
            return true;
        }

        // User can edit their own message
        return $message->user_id === $user->id;
    }

    /**
     * Can user delete (soft delete) a message?
     */
    public function delete(User $user, Message $message)
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $message->user_id === $user->id;
    }

    /**
     * Can user restore a deleted message?
     */
    public function restore(User $user, Message $message)
    {
        return $user->isAdmin();
    }

    /**
     * Can user permanently delete a message?
     */
    public function forceDelete(User $user, Message $message)
    {
        return $user->isAdmin();
    }
}
