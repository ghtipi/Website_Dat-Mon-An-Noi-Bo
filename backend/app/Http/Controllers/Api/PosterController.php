<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Poster;

class PosterController extends Controller
{
    // Lấy danh sách poster
    public function index()
    {
        return response()->json(Poster::all());
    }

    // Tạo mới poster
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'image' => 'required|string', 
            'status' => 'required|string',
            'position' => 'nullable|integer',
        ]);

        $poster = Poster::create($request->all());

        return response()->json([
            'message' => 'Poster created successfully.',
            'data' => $poster
        ], 201);
    }

    // Xem chi tiết một poster
    public function show($id)
    {
        $poster = Poster::find($id);

        if (!$poster) {
            return response()->json(['message' => 'Poster not found.'], 404);
        }

        return response()->json($poster);
    }

    // Cập nhật poster
    public function update(Request $request, $id)
    {
        $poster = Poster::find($id);

        if (!$poster) {
            return response()->json(['message' => 'Poster not found.'], 404);
        }

        $poster->update($request->only([
            'title', 'description', 'image', 'status', 'position'
        ]));

        return response()->json([
            'message' => 'Poster updated successfully.',
            'data' => $poster
        ]);
    }

    // Xóa poster
    public function destroy($id)
    {
        $poster = Poster::find($id);

        if (!$poster) {
            return response()->json(['message' => 'Poster not found.'], 404);
        }

        $poster->delete();

        return response()->json(['message' => 'Poster deleted successfully.']);
    }
}
