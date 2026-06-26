export interface AuthResponse {
  message?: string;
  user?: {
    name: string;
    username: string;
    email?: string;
  };
  access_token?: string;
}

export const registerUser = async (name: string, username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, password }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to register';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  // Registration returns user schema.
  return {
    message: 'Registration successful',
    user: {
      name: data.name,
      username: data.username,
      email: data.email
    }
  };
};

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  // 1. Get the token
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to login';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch {
      errorMsg = response.statusText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const token = data.token;
  
  if (!token) {
    throw new Error('No token received from backend');
  }

  // Save the token
  localStorage.setItem('safeher_token', token);

  // 2. Fetch the user details using the token
  const authResponse = await fetch('/api/user/is_auth', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!authResponse.ok) {
    throw new Error('Failed to fetch user details after login');
  }

  const userData = await authResponse.json();

  return {
    message: 'Login successful',
    access_token: token,
    user: {
      name: userData.name,
      username: userData.username,
      email: userData.email
    }
  };
};
