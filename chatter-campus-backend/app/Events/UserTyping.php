<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserTyping implements ShouldBroadcast
{
    public $userName;
    public $spaceId;
    public $typing;

    public function __construct($userName, $spaceId, $typing)
    {
        $this->userName = $userName;
        $this->spaceId = $spaceId;
        $this->typing = $typing;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('space.' . $this->spaceId);
    }

    public function broadcastAs()
    {
        return 'UserTyping';
    }
}
