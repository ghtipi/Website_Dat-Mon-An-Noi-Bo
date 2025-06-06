<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'role' => $request->role ?? 'user',
            'status' => 'active',
            'phone' => $request->phone ?? '',
            'default_address' => $request->default_address ?? '',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // Đăng nhập
    public function login(Request $request)
{
    $credentials = $request->only('email', 'password');
    $credentials['status'] = 'active';

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['error' => 'Email, mật khẩu không đúng hoặc tài khoản chưa được kích hoạt'], 401);
    } 

    return response()->json([
        'token' => $token,
        'user' => auth()->user()
    ]);
}


    // Đăng xuất
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Đăng xuất thành công']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Không thể đăng xuất'], 500);
        }
    }

    // Lấy thông tin người dùng hiện tại
    public function me()
    {
        return response()->json(auth()->user());
    }
}
