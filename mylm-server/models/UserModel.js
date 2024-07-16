class User {
  constructor(
    id,
    name,
    email,
    password,
    role, //default 'user'
    createdAt = new Date(),
    isDeleted = false,
    deletedAt = null,
    updatedAt = new Date(),
    avatarPath = null
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
    this.updatedAt = updatedAt;
    this.avatarPath = avatarPath;
  }

  // Getters
  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getRole() {
    return this.role;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getIsDeleted() {
    return this.isDeleted;
  }

  getDeletedAt() {
    return this.deletedAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getAvatarPath() {
    return this.avatarPath;
  }

  // Setters
  setId(id) {
    if (!id) throw new Error('ID is required');
    this.id = id;
  }

  setName(name) {
    if (!name) throw new Error('Name is required');
    this.name = name;
  }

  setEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error('Invalid email format');
    this.email = email;
  }

  setPassword(password) {
    if (!password || password.length < 6)
      throw new Error('Password must be at least 6 characters long');
    this.password = password;
  }

  setRole(role) {
    if (!role) throw new Error('Role is required');
    this.role = role;
  }

  setCreatedAt(createdAt) {
    if (!(createdAt instanceof Date))
      throw new Error('CreatedAt must be a Date object');
    this.createdAt = createdAt;
  }

  setIsDeleted(isDeleted) {
    this.isDeleted = isDeleted;
  }

  setDeletedAt(deletedAt) {
    if (deletedAt && !(deletedAt instanceof Date))
      throw new Error('DeletedAt must be a Date object or null');
    this.deletedAt = deletedAt;
  }

  setUpdatedAt(updatedAt) {
    if (!(updatedAt instanceof Date))
      throw new Error('UpdatedAt must be a Date object');
    this.updatedAt = updatedAt;
  }

  setAvatarPath(avatarPath) {
    this.avatarPath = avatarPath;
  }
}
