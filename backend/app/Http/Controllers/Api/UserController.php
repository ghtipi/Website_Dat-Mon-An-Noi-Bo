<?php

namespace App\Http\Controllers\Api;


use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Lấy thông tin cá nhân người dùng đang đăng nhập
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
     * Cập nhật thông tin cá nhân (bao gồm avatar)
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'default_address' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'avatar' => 'sometimes|nullable|url|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'phone', 'default_address', 'email', 'avatar']);
            foreach ($data as $key => $value) {
                $user->$key = $value;
            }
            $user->save();

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
    

    /**
     * Người dùng tự xóa tài khoản (cần xác nhận mật khẩu)
     */
    
    

    // ==============================
    // CHỨC NĂNG CHO ADMIN
    // ==============================

    /**
     * Admin: Lấy danh sách người dùng (có phân trang)
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Admin: Xem thông tin 1 user
     */
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Admin: Cập nhật thông tin user
     */
    public function adminUpdate(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'default_address' => 'sometimes|string|max:255',
            'avatar' => 'sometimes|nullable|url|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($request->only(['name', 'email', 'phone', 'default_address', 'avatar']));
            return response()->json([
                'status' => 'success',
                'message' => 'Thông tin người dùng đã được cập nhật',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể cập nhật thông tin người dùng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa người dùng
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        User::where('_id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Xóa người dùng thành công'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'default_address' => 'nullable|string|max:255',
            'role' => 'required|in:user,admin,manager',
            'status' => 'required|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->phone = $request->phone;
        $user->default_address = $request->default_address;
        $user->role = $request->role;
        $user->status = 'active';
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo người dùng thành công',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'default_address' => 'nullable|string|max:255',
            'role' => 'sometimes|required|in:user,admin,manager',
            'status' => 'sometimes|required|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->fill($request->only([
            'name',
            'email',
            'phone',
            'default_address',
            'role',
            'status'
        ]));
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật người dùng thành công',
            'data' => $user
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        User::where('_id', $id)->update(['status' => $request->status]);
        $user->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $user
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy người dùng'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'role' => 'required|in:user,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        User::where('_id', $id)->update(['role' => $request->role]);
        $user->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật vai trò thành công',
            'data' => $user
        ]);
    }
}
