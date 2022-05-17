import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sub, ...result } = payload;
    const { user } = await this.prisma.token.findUnique({
      where: {
        jti: sub,
      },
      select: { user: { select: { id: true, uuid: true, role: true } } },
    });
    return {
      id: user.id,
      uuid: user.uuid,
      role: user.role,
    };
  }
}
