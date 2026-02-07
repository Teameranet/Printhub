# PrintHub Authentication System

## Overview
Clean, modern authentication system with OTP-based phone authentication using Supabase.

## Features

### ✨ Design
- **Clean White Input Boxes**: Simple, minimalist design with perfect spacing
- **Perfect Icon Alignment**: Icons are absolutely positioned and vertically centered
- **Proper Input Padding**: Text is properly padded to avoid icon overlap
- **Responsive Design**: Works seamlessly on all devices

### 🔐 Authentication Modes

#### 1. Sign Up
Required fields:
- **Full Name** (text input with user icon)
- **Profile Type** (dropdown: Regular, Student, Institute)
- **Mobile Number** (10-digit phone number with phone icon)

#### 2. Sign In
Required fields:
- **Mobile Number** (10-digit phone number)
- **Forgot Password** link (for future implementation)

#### 3. OTP Verification
- Dedicated OTP view with centered, spacious input
- 6-digit code entry with large, letter-spaced display
- Resend OTP functionality
- Change number option

## Supabase Integration

### Setup Requirements

1. **Enable Phone Authentication in Supabase**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Phone provider
   - Configure SMS provider (Twilio, MessageBird, etc.)

2. **Configure SMS Provider**
   ```
   Supabase Dashboard > Authentication > Providers > Phone
   - Enable Phone Sign-in
   - Add your SMS provider credentials
   ```

3. **Environment Variables**
   Already configured in `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Authentication Flow

1. **Sign Up Flow**:
   ```
   User enters: Full Name, Profile Type, Mobile Number
   → Supabase sends OTP via SMS
   → User enters OTP
   → Account created with profile data
   → User logged in automatically
   ```

2. **Sign In Flow**:
   ```
   User enters: Mobile Number
   → Supabase sends OTP via SMS
   → User enters OTP
   → User logged in
   ```

3. **Profile Data Storage**:
   User metadata is stored in Supabase auth.users table:
   ```javascript
   {
     full_name: "John Doe",
     profile_type: "student"
   }
   ```

## Implementation Details

### Component Structure

```
frontend/user/
├── AuthModal.jsx       # Main authentication component
└── AuthModal.css       # Clean, modern styling
```

### Key Functions

#### `handleSignUp()`
- Validates form data
- Formats phone number (+91 prefix)
- Sends OTP via Supabase
- Stores user metadata (full_name, profile_type)
- Switches to OTP view

#### `handleSignIn()`
- Validates mobile number
- Formats phone number
- Sends OTP via Supabase
- Switches to OTP view

#### `handleVerifyOTP()`
- Verifies 6-digit OTP
- Updates user profile if signup
- Closes modal on success
- Handles authentication state

#### `handleResendOTP()`
- Resends OTP to same number
- Shows success message
- Handles rate limiting

### Phone Number Format
- Input: 10 digits (e.g., 9876543210)
- Stored: +91 prefix (e.g., +919876543210)
- Validation: Pattern `[0-9]{10}`

## Usage

### In Your Component

```jsx
import AuthModal from '../user/AuthModal.jsx';

function YourComponent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsAuthModalOpen(true)}>
        Sign In
      </button>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
```

### Authentication State

The app automatically tracks authentication state:

```jsx
// In App.jsx
const [user, setUser] = useState(null);

useEffect(() => {
  // Check initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Accessing User Data

```jsx
// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Access profile data
const fullName = user?.user_metadata?.full_name;
const profileType = user?.user_metadata?.profile_type;
const phone = user?.phone;
```

## Styling Highlights

### Input Fields
- White background with subtle gray border
- Purple focus state with glow effect
- Smooth transitions
- Perfect icon positioning

### OTP Input
- Large, centered text (1.5rem)
- Letter-spaced for readability
- 6-digit validation
- Spacious padding

### Submit Button
- Purple gradient background
- Hover lift effect
- Loading state with spinner
- Disabled state handling

### Error Messages
- Red background for errors
- Green background for success
- Rounded corners
- Center-aligned text

## Testing

### Test Phone Numbers (Supabase Development)
When testing in development mode, you can use test phone numbers:

1. Go to Supabase Dashboard > Authentication > Settings
2. Add test phone numbers under "Phone Auth"
3. Use format: +919999999999

### Production Setup
1. Configure real SMS provider (Twilio recommended)
2. Add billing information
3. Verify sender ID/phone number
4. Test with real phone numbers

## Security Features

- ✅ OTP-based authentication (no passwords)
- ✅ Phone number validation
- ✅ Rate limiting on OTP requests
- ✅ Secure token storage
- ✅ Automatic session management
- ✅ HTTPS required for production

## Troubleshooting

### OTP Not Received
1. Check SMS provider configuration
2. Verify phone number format (+91 prefix)
3. Check Supabase logs for errors
4. Ensure SMS credits are available

### Invalid OTP Error
1. Verify 6-digit code
2. Check if OTP expired (usually 60 seconds)
3. Try resending OTP
4. Check for typos

### Profile Data Not Saving
1. Verify user_metadata structure
2. Check Supabase auth logs
3. Ensure proper permissions
4. Validate data format

## Future Enhancements

- [ ] Email authentication option
- [ ] Social login (Google, Facebook)
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Remember device option
- [ ] Session timeout settings

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review authentication logs in Supabase dashboard
3. Test with different phone numbers
4. Verify SMS provider status
