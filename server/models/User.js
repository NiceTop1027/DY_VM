import { db } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// 사용자 생성
export const createUser = async (userData) => {
  const userRef = doc(db, USERS_COLLECTION, userData.id);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return userData;
};

// 이메일로 사용자 조회
export const getUserByEmail = async (email) => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return querySnapshot.docs[0].data();
};

// ID로 사용자 조회
export const getUserById = async (id) => {
  const userRef = doc(db, USERS_COLLECTION, id);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    return null;
  }
  
  return userSnap.data();
};

// 모든 사용자 조회
export const getAllUsers = async () => {
  const usersRef = collection(db, USERS_COLLECTION);
  const querySnapshot = await getDocs(usersRef);
  
  return querySnapshot.docs.map(doc => doc.data());
};

// 사용자 업데이트
export const updateUser = async (id, updates) => {
  const userRef = doc(db, USERS_COLLECTION, id);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

// 사용자 삭제
export const deleteUser = async (id) => {
  const userRef = doc(db, USERS_COLLECTION, id);
  await deleteDoc(userRef);
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
