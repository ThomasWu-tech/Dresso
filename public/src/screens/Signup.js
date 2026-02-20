const Signup = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await window.api.signup(username, email, password);
      localStorage.setItem('token', data.access_token);
      window.location.href = 'closet.html';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F2F2F7] dark:bg-black p-6">
      <div className="w-full max-w-md mt-16 space-y-10">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-[#007AFF] rounded-[22px] flex items-center justify-center shadow-lg shadow-[#007AFF]/20 mb-6">
            <span className="material-symbols-outlined text-white text-4xl">person_add</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Create Account
          </h2>
          <p className="text-[#8E8E93] text-lg">
            Join the Dresso community
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            <div className="px-4 py-3.5">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full bg-transparent border-none p-0 text-lg text-black dark:text-white placeholder:text-[#C7C7CC] focus:ring-0"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="px-4 py-3.5">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-transparent border-none p-0 text-lg text-black dark:text-white placeholder:text-[#C7C7CC] focus:ring-0"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="px-4 py-3.5">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-transparent border-none p-0 text-lg text-black dark:text-white placeholder:text-[#C7C7CC] focus:ring-0"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-[#FF3B30] text-center text-sm font-medium px-4">
              {error}
            </p>
          )}

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#007AFF] text-white rounded-2xl text-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#007AFF]/20"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <a 
              href="login.html" 
              className="block w-full text-center py-2 text-[#007AFF] font-medium text-lg"
            >
              Already have an account? Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

window.Signup = Signup;
