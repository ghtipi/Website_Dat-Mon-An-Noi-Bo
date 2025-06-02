<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ImageController extends Controller
{
    protected $cloudinary;
    /**
     * Xóa ảnh từ Cloudinary
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
   public function deleteImage(Request $request)
{
    $request->validate([
        'public_id' => 'required|string'
    ]);

    try {
        Cloudinary::destroy($request->public_id);
        return response()->json(['message' => 'Image deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete image', 'details' => $e->getMessage()], 500);
    }
}
} 