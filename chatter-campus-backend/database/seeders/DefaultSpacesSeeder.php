<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Space;

class DefaultSpacesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // General Space
        Space::firstOrCreate(
            ['name' => 'General'],
            [
                'description' => 'A general group where every student can chat regardless of their faculty or department.',
                'faculty' => null,
                'department' => null,
                'level' => null,
            ]
        );

        $faculties = [
            'Natural and Applied Science',
            'Computing',
            'Arts',
        ];

        foreach ($faculties as $faculty) {
            Space::firstOrCreate(
                ['name' => $faculty . ' General', 'faculty' => $faculty],
                [
                    'description' => "A general group for all departments in the Faculty of $faculty.",
                    'department' => null,
                    'level' => null,
                ]
            );
        }
    }
}
