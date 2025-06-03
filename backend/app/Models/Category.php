<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\BSON\ObjectId;
use App\Models\MenuItem;

class Category extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'status',

    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Truy xuất các món ăn thuộc danh mục này.
     * Sử dụng `category_ids` là mảng trong MenuItem.
     */
    public function menuItems()
    {
        return MenuItem::whereJsonContains('category_ids', (string) $this->_id)->get();
    }
}
