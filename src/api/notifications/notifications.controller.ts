import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';

import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { NotificationMarkAsReadRequestDto } from './dto/mark-notification-as-read.dto';
import { NotificationListResponseDto } from './dto/notification-list-response.dto';
import { NotificationsService } from './notifications.service';

@Controller({
  path: 'notifications',
  version: '1',
})
@ApiTags('Notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all notifications of logged in user',
  })
  @ApiBody({
    type: [NotificationListResponseDto],
  })
  findAll(@AuthUser() user: DecodedTokenPayload) {
    return this.notificationsService.getAllNotifications(user.userId);
  }

  @Post('read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Mark notification as read',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: [NotificationMarkAsReadRequestDto] })
  @ApiResponse({})
  create(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createPostDto: [NotificationMarkAsReadRequestDto],
  ) {
    return this.notificationsService.markNotificationsAsRead(
      user.userId,
      createPostDto,
    );
  }
}
