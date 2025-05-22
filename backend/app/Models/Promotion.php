<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Promotion extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'promotions';

    protected $fillable = [
        'code', 'description', 'discount', 'status', 'valid_from', 'valid_until',
    ];

    protected $dates = ['valid_from', 'valid_until', 'created_at', 'updated_at'];
}