/**
 * Пост
 */
export interface IPost {
  /**
   * Индификатор поста
   */
  id: string;

  /**
   * Название/текст поста
   */
  name: string;

  /**
   * Пост на редактировании
   */
  isEditing?: boolean;
}
