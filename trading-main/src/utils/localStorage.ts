/**
 * localStorage 사용 가능 여부 확인
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const storage = window.localStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 로컬 스토리지에서 데이터를 가져오는 함수
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`로컬 스토리지에서 ${key} 읽기 실패:`, error);
    return defaultValue;
  }
};

/**
 * 로컬 스토리지에 데이터를 저장하는 함수
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`로컬 스토리지에 ${key} 저장 실패:`, error);
  }
}; 