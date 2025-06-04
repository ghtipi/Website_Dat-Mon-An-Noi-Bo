<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Poster extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'posters';

    protected $fillable = [
        'title',
        'description',
        'image',
        'status',
        'position',

    ];

    protected $casts = [
        'status' => 'string',
    ];

    
}

