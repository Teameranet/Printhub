# User Interface Updates

## User Authentication & Profile Features
1. User Display
   - After login/signup, show username (e.g. "Ashwin") next to profile icon
   - Add logout option in dropdown menu

2. Profile Page Requirements
   - Create dedicated user profile page
   - Display user details and account information
   - Allow profile customization options

3. Navigation Menu Interactions
   - Add hover effect on username
   - Show dropdown menu with icons:
     - Profile option
     - Logout option

4. User Actions
   - Profile Click: Navigate to profile details page
   - Logout Click: 
     - Redirect to home page
     - Display "Successfully logged out" toast notification
   - Add hover effects on dropdown menu items

## Order Tracking Interface
5. Input Field Specifications
   - "Track Your Order Number" input field:
     - White background
     - Width: 448px
     - Height: 241.6px
     - Maintain current layout dimensions

6. Search Functionality
   - Position search icon inside input field box

7. Layout Requirements
   - "Tracking order detail" section:
     - Width: 896px
     - Height: 663.84px
   - Maintain input field dimensions (448px × 241.6px)

## Shopping Cart
- After user authentication:
  - Display "2" indicator in cart icon
  - Enable cart page view access
----------------------------------------------------------------
8. Cart Page Layout
   - "Cart" section:
     - Width: 896px
     - Height: 663.84px
   - "Cart Items" section:
     - Width: 896px
     - Height: 454.88px
   - "Cart Summary" section:
     - Width: 896px
     - Height: 150.4px
   - "Checkout" button:
     - Width: 288px
     - Height: 56px
   - "Empty Cart" button:
     - Width: 288px
     - Height: 56px
     ----------------------------------------------------------------
     Currently, the user data is mocked. You'll need to integrate this with your actual authentication system to:
Store and retrieve real user data
Implement proper login/logout functionality
Save profile changes to your backend
Add proper authentication protection for the profile route
