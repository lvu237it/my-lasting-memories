class User {
  constructor(
    id,
    name,
    email,
    password,
    role,
    createdAt,
    isDeleted,
    deletedAt
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
  }
}
