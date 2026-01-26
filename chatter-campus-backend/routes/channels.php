<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Space;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

use App\Models\User;

Broadcast::channel('chat.{roomId}', function (User $user, $roomId) {
    return $user;
});


Broadcast::channel('space.{spaceId}', function ($user, $spaceId) {
    return Space::find($spaceId)
        ?->users()
        ->where('users.id', $user->id)
        ->exists();
});

