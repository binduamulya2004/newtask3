import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  username: string = ''; // Directly stores the username
  email: string = ''; // Directly stores the email
  thumbnail: string = ''; // Default profile picture
   dropdownOpen: boolean = false; // Flag to control dropdown visibility
  selectedFile: File | null = null; // Stores the selected file for upload
  isUploading: boolean = false; // Indicates if file is being uploaded

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Get the logged-in user's details after verifying the token
    this.fetchUserDetails();
  }
   toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Method to verify the token and retrieve user details
 fetchUserDetails() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get(`${environment.apiUrl}/auth/user-details`, { headers })
        .subscribe(
          (response: any) => {
            this.username = response.username;
            this.email = response.email;
            this.thumbnail = response.profile_photo || 'assets/default-profile.jpg';
          },
          (error) => {
            console.error('Error fetching user details:', error);
            this.logout();
          }
        );
    // } else {
    //   console.log('No token found. Redirecting to login.');
    //   this.logout();
    // }
  }
}

  // Placeholder for uploading the profile photo
  uploadProfilePhoto(): void {
    console.log('Update Profile Pic clicked');
    // Logic for uploading will be implemented later
  }
  openProfilePhotoModal() {
    alert('Upload Profile Photo functionality is not implemented yet.');
  }


  // Method to handle file selection
  onFileChange($event: any) {
    const file = $event.target.files[0];
    console.log('Selected file:', file);
    // Add the code to upload the file to the server
  }

  // Logout method to clear localStorage and redirect to login page
  logout(): void {
    localStorage.clear(); // Clear the local storage
    window.location.href = '/login'; // Redirect to login page
    console.log('Logout clicked');
  }
  
}
