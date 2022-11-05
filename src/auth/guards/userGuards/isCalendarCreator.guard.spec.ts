import { IsCalendarCreatorGuard } from './isCalendarCreator.guard';
import { AuthService } from 'src/auth/auth.service';

describe('IsCalendarCreatorGuard', () => {
  it('should be defined', () => {
    expect(new IsCalendarCreatorGuard(<AuthService>{})).toBeDefined();
  });
});
