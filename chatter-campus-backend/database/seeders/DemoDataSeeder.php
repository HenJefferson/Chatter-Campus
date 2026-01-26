<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Space;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@kotlinhigh.edu',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create some students
        $student1 = User::create([
            'name' => 'John Doe',
            'email' => 'john@kotlinhigh.edu',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        $student2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@kotlinhigh.edu',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        // Create Spaces
        $csSpace = Space::create([
            'name' => 'Computer Science',
            'description' => 'Discuss programming, algorithms, and tech projects',
            'faculty' => 'Computing',
            'department' => 'Computer Science',
        ]);

        $mathSpace = Space::create([
            'name' => 'Mathematics',
            'description' => 'Math discussions, problem solving, and study groups',
            'faculty' => 'Natural and Applied Science',
            'department' => 'Applied Physics', // Assuming Math is under Physics or similar for demo
        ]);

        $scienceSpace = Space::create([
            'name' => 'Science Department',
            'description' => 'Biology, Chemistry, Physics discussions',
            'faculty' => 'Natural and Applied Science',
        ]);

        $artsSpace = Space::create([
            'name' => 'Arts & Humanities',
            'description' => 'Literature, history, and creative arts',
            'faculty' => 'Arts',
        ]);

        // Add users to spaces
        $csSpace->users()->attach([$admin->id, $student1->id, $student2->id]);
        $mathSpace->users()->attach([$admin->id, $student1->id]);
        $scienceSpace->users()->attach([$admin->id, $student2->id]);
        $artsSpace->users()->attach([$admin->id, $student1->id, $student2->id]);

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Admin: admin@kotlinhigh.edu / password');
        $this->command->info('Student 1: john@kotlinhigh.edu / password');
        $this->command->info('Student 2: jane@kotlinhigh.edu / password');
    }
}
