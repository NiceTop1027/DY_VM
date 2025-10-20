// In-memory user storage (replace with database in production)
const users = new Map();

// 사용자 생성
export const createUser = async (userData) => {
  const user = {
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.set(userData.id, user);
  return user;
};

// 이메일로 사용자 조회
export const getUserByEmail = async (email) => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// ID로 사용자 조회
export const getUserById = async (id) => {
  return users.get(id) || null;
};

// 모든 사용자 조회
export const getAllUsers = async () => {
  return Array.from(users.values());
};

// 사용자 업데이트
export const updateUser = async (id, updates) => {
  const user = users.get(id);
  if (user) {
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    users.set(id, updatedUser);
  }
};

// 사용자 삭제
export const deleteUser = async (id) => {
  users.delete(id);
};

// 초기 계정 생성 (관리자가 미리 생성)
export const initializePredefinedAccounts = async (bcrypt) => {
  const predefinedAccounts = [
    {
      id: 'student1',
      username: 'student1',
      email: 'student1@school.com',
      password: 'password123',
      fullName: '학생1',
      assignedVMs: [100, 101],
      role: 'student'
    },
    {
      id: 'student2',
      username: 'student2',
      email: 'student2@school.com',
      password: 'password123',
      fullName: '학생2',
      assignedVMs: [102],
      role: 'student'
    },
    {
      id: 'admin',
      username: 'admin',
      email: 'admin@school.com',
      password: 'admin123',
      fullName: '관리자',
      assignedVMs: [],
      role: 'admin'
    }
  ];

  for (const account of predefinedAccounts) {
    // 이미 존재하는지 확인
    const existingUser = await getUserByEmail(account.email);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(account.password, 10);
      await createUser({
        ...account,
        password: hashedPassword
      });
      console.log(`✅ Created user: ${account.email}`);
    }
  }
};
