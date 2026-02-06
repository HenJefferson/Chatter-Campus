<?php

namespace App\Listeners;

use App\Events\MessageSent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\NewMessageNotification;
use Illuminate\Support\Facades\Notification;

class SendNewMessageNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        $message = $event->message;
        $space = $message->space;
        $sender = $message->user;

        // Get all users in the space, excluding the sender
        $recipients = $space->users->where('id', '!=', $sender->id);

        Notification::send($recipients, new NewMessageNotification($message, $sender));
    }

    /**
     * Handle a job that was interrupted by a timeout.
     */
    public function timeout(): void
    {
        //
    }
}
