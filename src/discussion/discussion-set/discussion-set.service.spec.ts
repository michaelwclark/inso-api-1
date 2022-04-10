import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionSetService } from './discussion-set.service';

describe('DiscussionSetService', () => {
  let service: DiscussionSetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscussionSetService],
    }).compile();

    service = module.get<DiscussionSetService>(DiscussionSetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
