@Entry
@Component
struct QuickActionCard {
  /*
   * The title.
   */
  readonly TITLE: string = '影院热映';
  /*
   * The action type.
   */
  readonly ACTION_TYPE: string = 'router';
  /*
   * The ability name.
   */
  readonly ABILITY_NAME: string = 'EntryAbility';
  /*
   * The message.
   */
  readonly MESSAGE: string = 'home';
  /*
   * The width percentage setting.
   */
  readonly FULL_WIDTH_PERCENT: string = '100%';
  /*
   * The height percentage setting.
   */
  readonly FULL_HEIGHT_PERCENT: string = '100%';

  build() {
    FormLink({
      action: this.ACTION_TYPE,
      abilityName: this.ABILITY_NAME,
      params: {
        action: this.MESSAGE
      }
    }) {
      Row() {
        Text('影院热映').fontSize(14)
          .fontColor($r('app.color.card_label'))
        Image($r('app.media.icon'))
          .width(32)
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .height(this.FULL_HEIGHT_PERCENT)
      .width('100%')
      .padding({
        top: 10,
        left: 12,
        right: 12,
        bottom: 10
      })
      .backgroundColor($r('app.color.background_color'))
    }
  }
}