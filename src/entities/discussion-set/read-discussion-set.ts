export class DiscussionSetReadDTO {
  public id: string;
  public insoCode: string;
  public name: string;
  public created: string;
  public archived: string;
  public facilitators: {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
  }[];
  public poster: {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
  };
  public discussions: {
    id: string;
    insoCode: string;
    name: string;
    created: string;
    archived: string;
    poster: {
      id: string;
      username: string;
      f_name: string;
      l_name: string;
    };
  }[];

  constructor(partial: Partial<DiscussionSetReadDTO>) {
    Object.assign(this, partial);
  }
}
