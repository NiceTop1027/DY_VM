// 사용자 저장소 (auth.js와 공유)
export const users = new Map();

// 사용자 조회 함수
export const getUserByEmail = (email) => {
  return users.get(email);
};

export const getUserById = (id) => {
  return Array.from(users.values()).find(u => u.id === id);
};
