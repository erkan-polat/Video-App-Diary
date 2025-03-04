import * as SQLite from "expo-sqlite";

// 📌 Use openDatabaseSync (Expo SDK 49+)
const db = SQLite.openDatabaseSync("videos.db");

// 📌 Veritabanını Başlatan Fonksiyon
export const setupDatabase = async () => {
  await db.writeTransactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      "CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, name TEXT, description TEXT);"
    );
  });
};

// 📌 Video Ekleme Fonksiyonu (ASYNC)
export const addVideoToDB = async (uri, name, description) => {
  await db.writeTransactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      "INSERT INTO videos (uri, name, description) VALUES (?, ?, ?);",
      [uri, name, description]
    );
  });
};

// 📌 Kayıtlı Videoları Getirme Fonksiyonu (ASYNC)
export const getVideosFromDB = async () => {
  return await db.readTransactionAsync(async (tx) => {
    const result = await tx.executeSqlAsync("SELECT * FROM videos;");
    return result.rows;
  });
};

// 📌 Videoyu Güncelleme Fonksiyonu (ASYNC)
export const updateVideoInDB = async (id, name, description) => {
  await db.writeTransactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      "UPDATE videos SET name = ?, description = ? WHERE id = ?;",
      [name, description, id]
    );
  });
};

// 📌 Videoyu Silme Fonksiyonu (ASYNC)
export const deleteVideoFromDB = async (id) => {
  await db.writeTransactionAsync(async (tx) => {
    await tx.executeSqlAsync("DELETE FROM videos WHERE id = ?;", [id]);
  });
};

export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, name TEXT, description TEXT, start REAL, end REAL);"
    );
  });
};

export const insertVideo = (uri, name, description, start, end) => {
  db.transaction((tx) => {
    tx.executeSql("INSERT INTO videos (uri, name, description, start, end) VALUES (?, ?, ?, ?, ?);", [
      uri,
      name,
      description,
      start,
      end,
    ]);
  });
};

export const getVideos = (callback) => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM videos;", [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};


