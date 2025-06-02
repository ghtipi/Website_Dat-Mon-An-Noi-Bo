<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Category extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'categories';

    protected $fillable = [
        'name','slug','description','image', 'status',
    ];

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'category_id', '_id');
    }
}