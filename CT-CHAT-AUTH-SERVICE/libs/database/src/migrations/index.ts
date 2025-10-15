import { First1711454621081 } from './1711454621081-first';
import { Role1711519509053 } from './1711519509053-role';
import { ParentId1711567005425 } from './1711567005425-parent_id';
import { UserInfo1711604065895 } from './1711604065895-userInfo';
import { AddedDeletedAt1712752882096 } from './1712752882096-addedDeletedAt';
import { JsonB1714392240189 } from './1714392240189-jsonB';
import { Bname1716448699267 } from './1716448699267-bname';
import { FcmTokenCreation1733167450626 } from './1733167450626-fcmTokenCreation';
import { Timestamps1733994581779 } from './1733994581779-timestamps';
import { DisableSchool1734683467217 } from './1734683467217-disable-school';
import { EnableChat1734722034216 } from './1734722034216-enable-chat';

export const migrations = [
  First1711454621081,
  Role1711519509053,
  ParentId1711567005425,
  UserInfo1711604065895,
  AddedDeletedAt1712752882096,
  JsonB1714392240189,
  Bname1716448699267,
  FcmTokenCreation1733167450626,
  Timestamps1733994581779,
  DisableSchool1734683467217,
  EnableChat1734722034216,
];

export * from './1711454621081-first';
export * from './1711519509053-role';
export * from './1711567005425-parent_id';
export * from './1711604065895-userInfo';
export * from './1712752882096-addedDeletedAt';
export * from './1714392240189-jsonB';
export * from './1716448699267-bname';
export * from './1733167450626-fcmTokenCreation';
export * from './1733994581779-timestamps';
export * from './1734722034216-enable-chat';
export * from './1734683467217-disable-school';