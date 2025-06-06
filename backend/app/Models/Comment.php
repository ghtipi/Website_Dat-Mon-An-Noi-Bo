<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
class Comment extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';  

    protected $collection = 'comments'; 

    protected $fillable = [
        'user_id',       
        'target_type',   
        'target_id',     
        'comment',       
        'rating',        
    ];

    public $timestamps = true; 

    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
