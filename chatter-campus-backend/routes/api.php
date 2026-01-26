<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\UserTyping;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Auth\LoginController;



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [RegisterController::class, 'register']);

//Login 
Route::post('/login', [LoginController::class, 'login']);

// Reference Data
Route::get('/reference/faculties', [\App\Http\Controllers\ReferenceController::class, 'getFaculties']);
Route::get('/reference/levels', [\App\Http\Controllers\ReferenceController::class, 'getLevels']);
/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // 🟡 Typing indicator
    Route::post('/typing', function (Request $request) {
        $request->validate([
            'space_id' => 'required|exists:spaces,id',
            'typing' => 'required|boolean',
        ]);

        broadcast(new UserTyping(
            $request->user()->name,
            $request->space_id,
            $request->typing
        ))->toOthers();

        return response()->json(['status' => 'typing']);
    });





    // 🔔 Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // 👤 Current user
    Route::get('/user', fn(Request $request) => $request->user());

    // 👥 User Management
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::get('/users/{user}', [\App\Http\Controllers\UserController::class, 'show']);
    Route::patch('/users/{user}', [\App\Http\Controllers\UserController::class, 'update']);

    // 💬 Direct Messages
    Route::get('/direct-messages', [\App\Http\Controllers\DirectMessageController::class, 'index']);
    Route::get('/direct-messages/{user}', [\App\Http\Controllers\DirectMessageController::class, 'show']);
    Route::post('/direct-messages', [\App\Http\Controllers\DirectMessageController::class, 'store']);

    // 🏫 Spaces
    Route::get('/spaces', [SpaceController::class, 'index']);
    Route::get('/spaces/{space}', [SpaceController::class, 'show']);
    Route::post('/spaces', [SpaceController::class, 'store']);

    // 👥 Membership
    Route::post('/spaces/{space}/join', [SpaceController::class, 'join']);
    Route::post('/spaces/{space}/users', [SpaceController::class, 'addUser']);
    Route::get('/spaces/{space}/users', [SpaceController::class, 'members']);

    // 💬 Messages
    Route::post('/spaces/{space}/messages', [MessageController::class, 'store']);
    Route::get('/spaces/{space}/messages', [MessageController::class, 'index']);

    Route::patch('/messages/{message}', [MessageController::class, 'update']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
    Route::post('/messages/{id}/restore', [MessageController::class, 'restore']);
    Route::delete('/messages/{message}/force', [MessageController::class, 'forceDestroy']);
});
