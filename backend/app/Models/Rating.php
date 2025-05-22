<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Rating extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'ratings';

    protected $fillable = [
        'user_id', 'menu_id', 'rating', 'comment',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', '_id');
    }

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'menu_id', '_id');
    }
}