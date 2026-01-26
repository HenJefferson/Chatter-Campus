<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    public function getFaculties()
    {
        return response()->json([
            'Natural and Applied Science' => ['Biochemistry', 'MicroBiology', 'Applied Physics'],
            'Computing' => ['Computer Science', 'Software Engineering', 'Cyber Security'],
            'Arts' => ['Theater Arts', 'English', 'History'],
        ]);
    }

    public function getLevels()
    {
        return response()->json(['100', '200', '300', '400']);
    }
}
