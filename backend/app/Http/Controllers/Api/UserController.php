<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Lấy thông tin cá nhân của người dùng đang đăng nhập
     */
    public function me()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'default_address' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'phone', 'default_address', 'email']);
            foreach ($data as $key => $value) {
                $user->$key = $value;
            }
            // $user->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Thông tin cá nhân đã được cập nhật',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể cập nhật thông tin cá nhân',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thay đổi mật khẩu
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|different:current_password',
            'new_password_confirmation' => 'required|string|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 422);
        }

        try {
            $user->password = Hash::make($request->new_password);
            // $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Mật khẩu đã được thay đổi thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể thay đổi mật khẩu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Auth::user();
            
            if ($request->hasFile('avatar')) {
                // Xóa avatar cũ nếu có
                if ($user->avatar) {
                    $oldAvatarPath = public_path('avatars/' . $user->avatar);
                    if (file_exists($oldAvatarPath)) {
                        unlink($oldAvatarPath);
                    }
                }

                // Upload avatar mới
                $avatar = $request->file('avatar');
                $avatarName = time() . '.' . $avatar->getClientOriginalExtension();
                $avatar->move(public_path('avatars'), $avatarName);

                // $user->avatar = $avatarName;
                // $user->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Avatar đã được cập nhật',
                    'data' => [
                        'avatar_url' => url('avatars/' . $avatarName)
                    ]
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy file avatar'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể upload avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
