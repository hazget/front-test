import React, { useState } from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: any;
};

interface IButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// Компонент Button оптимизирован с помощью React.memo.
const Button: React.FC<IButtonProps> = React.memo(({ onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      get random user
    </button>
  );
});

interface IUserInfoProps {
  user: User;
}

// Компонент UserInfo оптимизирован с помощью React.memo.
const UserInfo: React.FC<IUserInfoProps> = React.memo(({ user }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Phone number</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.name}</td>
          <td>{user.phone}</td>
        </tr>
      </tbody>
    </table>
  );
});

// Добавлен кастомный хук useThrottle для задержки выполнения функции receiveRandomUser.
const useThrottle = (callback: Function, delay: number) => {
  const lastRan = React.useRef(Date.now());
  return React.useCallback(
    (...args: any) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        lastRan.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};

// Использован React.useCallback для оптимизации колбэков.
const App: React.FC = () => {
  const [item, setItem] = useState<User | null>(null);

  const receiveRandomUser = async () => {
    const id = Math.floor(Math.random() * (10 - 1)) + 1;
    const response = await fetch(`${URL}/${id}`);
    const _user = (await response.json()) as User;
    setItem(_user);
  };

  const throttledReceiveRandomUser = useThrottle(receiveRandomUser, 3000);

  const handleButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      throttledReceiveRandomUser();
    },
    [throttledReceiveRandomUser]
  );

  return (
    <div>
      <header>Get a random user</header>
      <Button onClick={handleButtonClick} />
      {item && <UserInfo user={item} />}
    </div>
  );
};

export default App;
