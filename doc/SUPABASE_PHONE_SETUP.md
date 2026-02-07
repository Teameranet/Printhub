# Supabase Phone Authentication Setup Guide

## Step-by-Step Configuration

### 1. Enable Phone Authentication

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Phone** in the list
4. Toggle **Enable Phone Sign-up** to ON

### 2. Choose SMS Provider

Supabase supports multiple SMS providers:

#### Option A: Twilio (Recommended)
- Most reliable
- Good documentation
- Pay-as-you-go pricing

#### Option B: MessageBird
- Competitive pricing
- Global coverage

#### Option C: Vonage (Nexmo)
- Enterprise-grade
- Good for high volume

### 3. Configure Twilio (Most Common)

#### Get Twilio Credentials

1. Sign up at https://www.twilio.com
2. Get a phone number from Twilio Console
3. Find your credentials:
   - Account SID
   - Auth Token
   - Phone Number

#### Add to Supabase

1. In Supabase Dashboard → Authentication → Providers → Phone
2. Select **Twilio** as provider
3. Enter:
   ```
   Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Auth Token: your_auth_token
   Phone Number: +1234567890
   ```
4. Click **Save**

### 4. Configure Phone Settings

In Supabase Dashboard → Authentication → Settings:

#### Phone Auth Settings
```
OTP Expiry: 60 seconds (default)
OTP Length: 6 digits (default)
Rate Limiting: Enabled (recommended)
```

#### Test Phone Numbers (Development Only)

Add test numbers for development:
```
+919999999999 → OTP: 123456
+919999999998 → OTP: 123456
```

### 5. Update Security Settings

#### Rate Limiting
```
Max OTP requests per hour: 5
Max verification attempts: 3
Lockout duration: 15 minutes
```

#### Allowed Countries
- Add India (+91) for your use case
- Add other countries as needed

### 6. Environment Variables

Already configured in your project:

```env
# frontend/.env
VITE_SUPABASE_URL=https://xekilodwvwbdkuzbfroc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7. Test the Setup

#### Development Testing

1. Use test phone numbers (if configured)
2. Check Supabase logs for OTP codes
3. Verify SMS delivery

#### Production Testing

1. Use real phone number
2. Verify SMS received
3. Test OTP verification
4. Check user creation in database

### 8. Database Schema (Optional)

Create a profiles table to store additional user data:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  profile_type TEXT CHECK (profile_type IN ('regular', 'student', 'institute')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, profile_type, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'profile_type',
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 9. SMS Template Customization

Customize your OTP SMS message:

1. Go to Authentication → Templates
2. Select **Phone OTP**
3. Customize message:
   ```
   Your PrintHub verification code is: {{ .Token }}
   Valid for 60 seconds.
   ```

### 10. Monitoring and Logs

#### Check Authentication Logs
```
Supabase Dashboard → Authentication → Logs
```

Monitor:
- OTP requests
- Verification attempts
- Failed authentications
- Rate limit hits

#### Check SMS Delivery
```
Twilio Dashboard → Logs → SMS Logs
```

Monitor:
- Delivery status
- Failed messages
- Cost per message

## Cost Estimation

### Twilio Pricing (Approximate)
- SMS to India: $0.0075 per message
- 1000 OTPs = ~$7.50
- 10,000 OTPs = ~$75

### Supabase Pricing
- Free tier: 50,000 monthly active users
- Pro tier: $25/month + usage

## Troubleshooting

### OTP Not Sending

**Check:**
1. ✅ Phone provider enabled in Supabase
2. ✅ Twilio credentials correct
3. ✅ Twilio phone number verified
4. ✅ Sufficient Twilio credits
5. ✅ Phone number format correct (+91...)

**Solution:**
```javascript
// Ensure phone number has country code
const phoneNumber = formData.mobileNumber.startsWith('+') 
  ? formData.mobileNumber 
  : `+91${formData.mobileNumber}`;
```

### Invalid OTP Error

**Check:**
1. ✅ OTP not expired (60 seconds)
2. ✅ Correct 6-digit code
3. ✅ No typos in phone number
4. ✅ Rate limit not exceeded

**Solution:**
- Use resend OTP feature
- Wait for rate limit cooldown
- Verify phone number matches

### User Not Created

**Check:**
1. ✅ Supabase auth enabled
2. ✅ User metadata structure correct
3. ✅ Database triggers working
4. ✅ RLS policies configured

**Solution:**
```javascript
// Verify metadata structure
const { data, error } = await supabase.auth.signInWithOtp({
  phone: phoneNumber,
  options: {
    data: {
      full_name: formData.fullName,
      profile_type: formData.profileType
    }
  }
});
```

## Security Best Practices

### 1. Rate Limiting
```javascript
// Implement client-side rate limiting
const [lastOtpRequest, setLastOtpRequest] = useState(null);

const canRequestOtp = () => {
  if (!lastOtpRequest) return true;
  const timeSince = Date.now() - lastOtpRequest;
  return timeSince > 60000; // 1 minute
};
```

### 2. Phone Number Validation
```javascript
// Validate Indian phone numbers
const isValidIndianPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};
```

### 3. OTP Expiry Handling
```javascript
// Show countdown timer
const [otpExpiry, setOtpExpiry] = useState(60);

useEffect(() => {
  if (mode === 'otp' && otpExpiry > 0) {
    const timer = setTimeout(() => {
      setOtpExpiry(otpExpiry - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }
}, [mode, otpExpiry]);
```

### 4. Secure Storage
```javascript
// Never store OTP in localStorage
// Supabase handles token storage securely
```

## Production Checklist

- [ ] SMS provider configured and tested
- [ ] Test phone numbers removed
- [ ] Rate limiting enabled
- [ ] OTP expiry set appropriately
- [ ] SMS template customized
- [ ] Database triggers created
- [ ] RLS policies configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Billing alerts configured
- [ ] Backup authentication method available

## Support Resources

- **Supabase Docs**: https://supabase.com/docs/guides/auth/phone-login
- **Twilio Docs**: https://www.twilio.com/docs/sms
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues

## Quick Reference

### Phone Number Format
```
Input:     9876543210
Stored:    +919876543210
Display:   +91 98765 43210
```

### OTP Format
```
Length:    6 digits
Expiry:    60 seconds
Attempts:  3 maximum
```

### API Endpoints
```javascript
// Send OTP
supabase.auth.signInWithOtp({ phone })

// Verify OTP
supabase.auth.verifyOtp({ phone, token, type: 'sms' })

// Get user
supabase.auth.getUser()

// Sign out
supabase.auth.signOut()
```
