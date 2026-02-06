<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Message;
use App\Models\User;

class NewMessageNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Message $message;
    public User $sender;

    /**
     * Create a new notification instance.
     */
    public function __construct(Message $message, User $sender)
    {
        $this->message = $message;
        $this->sender = $sender;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast']; // Store in DB, send via WebSocket
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message_id' => $this->message->id,
            'space_id' => $this->message->space_id,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'content' => $this->message->content ? substr($this->message->content, 0, 50) : 'New file message',
            'message' => $this->sender->name . ' sent a new message in ' . $this->message->space->name,
            'file_path' => $this->message->file_path,
            'file_type' => $this->message->file_type,
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message_id' => $this->message->id,
            'space_id' => $this->message->space_id,
            'sender_id' => $this->sender->id,
            'sender_name' => $this->sender->name,
            'content' => $this->message->content ? substr($this->message->content, 0, 50) : 'New file message',
            'message' => $this->sender->name . ' sent a new message in ' . $this->message->space->name,
            'file_path' => $this->message->file_path,
            'file_type' => $this->message->file_type,
            'read_at' => null, // Ensure frontend knows it's unread
            'created_at' => now()->toIso8601String(), // Send timestamp for consistency
        ]);
    }
}