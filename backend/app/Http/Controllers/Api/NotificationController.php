<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->isAdmin()
            ? Notification::all()
            : Notification::where('user_id', Auth::id())->get();
        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,_id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'in:order,general,promotion',
            'status' => 'in:unread,read',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification = Notification::create($request->all());
        return response()->json($notification, 201);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'status' => 'in:unread,read',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Auth::user()->isAdmin() && $notification->user_id != Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->update($request->only(['status']));
        return response()->json($notification);
    }
}