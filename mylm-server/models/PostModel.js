class Post {
  // post_id VARCHAR(50) PRIMARY KEY,
  //   content TEXT NOT NULL,
  //   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  //   is_deleted BOOLEAN DEFAULT FALSE,
  //   deletedAt DATETIME DEFAULT NULL,
  //   access_range enum('public, private, exceptional') default 'public'
  constructor(
    id,
    content,
    createdAt = new Date(),
    updatedAt = new Date(),
    isDeleted = false,
    deletedAt = null,
    access_range // default 'public'
  ) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
    this.deletedAt = deletedAt;
    this.access_range = access_range;
  }

  //Getters
  getId() {
    return this.id;
  }

  getContent() {
    return this.content;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getIsDeleted() {
    return this.isDeleted;
  }

  getDeletedAt() {
    return this.deletedAt;
  }

  getAccessRange() {
    return this.access_range;
  }

  //Setters
  setId(id) {
    if (!id) throw new Error('ID is required');
    this.id = id;
  }

  setContent(content) {
    if (!content) {
      throw new Error('Content is required');
    }
    this.content = content;
  }

  setCreatedAt(createdAt) {
    if (!(createdAt instanceof Date))
      throw new Error('CreatedAt must be a Date object');
    this.createdAt = createdAt;
  }

  setUpdatedAt(updatedAt) {
    if (!(updatedAt instanceof Date))
      throw new Error('UpdatedAt must be a Date object');
    this.updatedAt = updatedAt;
  }

  setIsDeleted(isDeleted) {
    this.isDeleted = isDeleted;
  }

  setDeletedAt(deletedAt) {
    if (deletedAt && !(deletedAt instanceof Date))
      throw new Error('DeletedAt must be a Date object or null');
    this.deletedAt = deletedAt;
  }

  setAccessRange(access_range) {
    if (!access_range) throw new Error('Access range is required');
    this.access_range = access_range;
  }
}
