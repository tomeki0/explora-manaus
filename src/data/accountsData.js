// Função auxiliar para carregar contas do Local Storage
const loadAccounts = () => {
    const storedAccounts = localStorage.getItem('accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  };
  
  // Função auxiliar para salvar contas no Local Storage
  const saveAccounts = (accounts) => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  };
  
  // Função para salvar o usuário logado no Local Storage
  const saveLoggedInUser = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  };
  
  // Função para obter o usuário logado
  const getLoggedInUser = () => {
    const storedUser = localStorage.getItem('loggedInUser');
    return storedUser ? JSON.parse(storedUser) : null;
  };
  
  let accountsData = loadAccounts(); // Carregar contas no início
  
  // Função para verificar login
  export const verifyAccount = (email, password) => {
    const user = accountsData.find(
      (account) => account.email === email && account.password === password
    );
    if (user) {
      saveLoggedInUser(user); // Salva o usuário logado
      return user;
    }
    return null;
  };
  
  // Função para registrar nova conta
  export const registerAccount = (name, email, password) => {
    const accountExists = accountsData.some((account) => account.email === email);
    if (accountExists) {
      return { success: false, message: 'Usuário já existe.' };
    }
  
    const newAccount = { name, email, password };
    accountsData.push(newAccount);
    saveAccounts(accountsData); // Salvar no Local Storage
    return { success: true, message: 'Usuário registrado com sucesso.' };
  };
  
  export { getLoggedInUser };
  export default accountsData;
  