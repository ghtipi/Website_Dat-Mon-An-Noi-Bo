<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    // Lấy danh sách comment (có thể thêm phân trang)
    public function index()
    {
        $comments = Comment::with('user')->paginate(10);
        return response()->json($comments);
    }

    // Lấy chi tiết comment theo id
    public function show($id)
    {
        $comment = Comment::with('user')->find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
        return response()->json($comment);
    }

    // Tạo comment mới
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'target_type' => 'required|string',
            'target_id' => 'required|string',
            'comment' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $comment = Comment::create($request->all());

        return response()->json($comment, 201);
    }

    // Cập nhật comment
    public function update(Request $request, $id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $request->validate([
            'comment' => 'sometimes|required|string',
            'rating' => 'sometimes|nullable|integer|min:1|max:5',
        ]);

        $comment->update($request->only(['comment', 'rating']));

        return response()->json($comment);
    }

    // Xóa comment
    public function destroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
