<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;
use App\Models\Category;
use App\Models\Rating;

class MenuItem extends Model
{
    use SoftDeletes;

    protected $connection = 'mongodb';
    protected $collection = 'menu_items'; // Đổi thành tên rõ ràng hơn nếu cần

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_ids', // Mảng các ObjectId danh mục
        'image',
        'status',
        'stock',
    ];

    protected $casts = [
        'price' => 'float',
        'stock' => 'integer',
        'category_ids' => 'array',
    ];

    /**
     * Truy xuất danh sách danh mục thuộc món ăn này.
     */
    public function getCategories()
    {
        return Category::whereIn('_id', array_map(function ($id) {
            return new ($id);
        }, $this->category_ids ?? []))->get();
    }

    /**
     * Quan hệ đánh giá món ăn (nếu có).
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'menu_id', '_id');
    }
}
