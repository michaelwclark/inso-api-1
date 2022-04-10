import { Module } from '@nestjs/common';
import { DiscussionService } from './discussion-metadata/discussion.service';
import { DiscussionSetService } from './discussion-set/discussion-set.service';
import { PostService } from './post/post.service';
import { ReactionService } from './post/reaction/reaction.service';
import { CalendarService } from './setting/calendar/calendar.service';
import { InspirationService } from './setting/inspiration/inspiration.service';
import { ScoreService } from './setting/score/score.service';
import { SettingService } from './setting/setting.service';

@Module({
  providers: [
    DiscussionService,
    DiscussionSetService,
    PostService,
    ReactionService,
    SettingService,
    CalendarService,
    InspirationService,
    ScoreService,
  ]
})
export class DiscussionModule {}
