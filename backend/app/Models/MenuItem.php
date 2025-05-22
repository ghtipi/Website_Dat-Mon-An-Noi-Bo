<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class MenuItem extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'menus';

    protected $fillable = [
        'name', 'description', 'price', 'category_id', 'image', 'status', 'stock',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', '_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'menu_id', '_id');
    }
}