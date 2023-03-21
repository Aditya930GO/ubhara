<template>
  <div ref="rdComponent" class="rd-component">
    <header class="rd-panel-header">
      <div class="rd-panel-header-details">
        <span class="rd-panel-title rd-headline-1">Overview</span>

      </div>
      <div class="rd-panel-header-icon-container">
        <rd-svg class="rd-panel-header-icon" :name="'analytic'" color="secondary" />
      </div>
    </header>
    <div class="rd-panel-body">
      <!-- <div class="rd-panel-content"> -->
      <div class="rd-header-container">
        <div class="rd-header" style="margin-left: 1rem ;">
          <div class="rd-placeholder rd-headline-1" style="font-weight: 800; font-size: 1rem">
            Peserta
          </div>
          <div class="rd-icon-container"></div>
          <div class="rd-count">
            <span class="rd-value rd-headline-2">{{ userDatas.user }}</span>
            <span class="rd-placeholder rd-caption-text">{{
              " orang"
            }}</span>
          </div>
        </div>
        <div class="rd-header" style="margin-right: 1rem ;">
          <div class="rd-placeholder rd-headline-1" style="font-weight: 800; font-size: 1rem">
            Kelas
          </div>
          <div class="rd-icon-container"></div>
          <div class="rd-count">
            <span class="rd-value rd-headline-2">{{ classDatas.class }}</span>
            <span class="rd-placeholder rd-caption-text">{{
              " Kelas"
            }}</span>
          </div>
        </div>
        <!-- </div> -->
        <!-- <div class="rd-cases-breakdown">

          <div class="rd-body">
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori I</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryOne }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori II</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryTwo }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Kategori III</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.categoryThree }}
              </div>
            </div>
          </div>
          <div class="rd-body">
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Pria</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.male }}
              </div>
            </div>
            <div class="rd-panel-divider"></div>
            <div class="rd-data">
              <div class="rd-name rd-body-text-1">Wanita II</div>
              <div class="rd-total-count rd-body-text-1">
                {{ inmatesData.female }}
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { getUsers } = useUser();
const { getClasses } = useClass();
const rdComponent = ref<HTMLElement>(null);
let number = 5
let usersData = [];
let classesData = [];
const classDatas = ref<CLASSTYPE>({
  class: 0,
});
interface CLASSTYPE {
  class: number | any;
}
const userDatas = ref<USERSTYPE>({
  user: 0,
});
interface USERSTYPE {
  user: number | any;
}

onMounted(async () => {
  usersData = await getUsers()
  classesData = await getClasses()

  for (const obj of usersData) {
    if (obj._id && obj.role === 'student') {
      userDatas.value.user++
    }
  }
  for (const obj of classesData) {
    if (obj._id) {
      classDatas.value.class++
    }
    // console.log(userDatas.counter)
    // setTimeout(() => {
    //   usersData = users.value
    //   for (const obj of usersData) {
    //     if (obj._id) counter++;
    //   }

    //   console.log(counter)
    // }, 100);
  }
});
</script>

<style lang="scss" scoped>
.rd-component {
  z-index: 2;
  position: fixed;
  right: 1.5rem;
  width: 18rem;
  top: 4rem;
  height: calc(100% - 5rem);
  background: var(--background-depth-one-color);
  overflow-x: hidden;
  overflow-y: visible;
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;

  // transform: scale(0.875);
  .rd-panel-divider {
    position: relative;
    left: -0.75rem;
    width: calc(100% + 1.5rem);
    height: 1px;
    margin: 0.75rem 0;
    // background: var(--font-color);
    opacity: 0.05;
  }

  header.rd-panel-header {
    z-index: 99999999;
    top: 4rem;
    position: fixed;
    width: 18rem;
    height: 3rem;
    padding: 1rem 1rem 1rem 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;

    .rd-panel-header-details {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      span.rd-panel-title {
        position: relative;
      }

      span.rd-panel-subtitle {
        position: relative;
        opacity: 0.5;
      }
    }

    .rd-panel-header-icon-container {
      position: relative;
      width: 1.75rem;
      height: 1.75rem;
      margin-top: 1rem;
      border-radius: 0.25rem;
      padding: 0 0.5rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: scale(1.25);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        background: var(--background-depth-two-color);
      }
    }
  }

  .rd-panel-body {
    top: 4rem;
    overflow-x: hidden;
    position: relative;
    height: 10rem;
    width: 100%;
    display: flex;
    flex-direction: column;

    .rd-header-container {
      width: 100%;
      display: flex;
      position: relative;
      justify-content: flex-start;
      justify-content: space-evenly;
      // top: 3rem;

      .rd-header {
        width: 50%;
        // padding: 0 0.5rem;
        margin: 0 0.5rem;
        background-color: var(--background-depth-two-color);
        padding: 0.75rem;
        flex-direction: column;
        position: relative;
        width: 100%;
        border-radius: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .rd-placeholder {
          position: relative;
          font-size: 0.65rem;
          font-weight: 600;
          line-height: 1;
        }

        .rd-icon-container {
          position: relative;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.5rem;
          background: var(--background-secondary-color);
          display: flex;
          justify-content: center;
          align-items: center;

          .rd-icon {
            font-size: 0.85rem;
          }
        }
      }

      .rd-cases-breakdown {
        position: relative;
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.75rem;
        margin-bottom: 0.5rem;
        border: 1px solid var(--border-color);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;



        .rd-body {
          position: relative;
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          width: 85%;
          padding: 1rem 1.3rem 1rem 1rem;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .rd-count {
            position: relative;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 1rem;
            align-items: flex-end;

            span.rd-value {
              position: relative;
              font-size: 1.25rem;
              font-weight: 700;
              line-height: 1;
            }

            span.rd-placeholder {
              position: relative;
              margin-left: 0.25rem;
              opacity: 0.8;
              margin-bottom: 0.2rem;
              font-size: 0.55rem;
              font-weight: 600;
              line-height: 1;
              color: var(--subtext-color);
            }
          }

          .rd-panel-divider {
            position: relative;
            left: 0.01rem;
            width: 14rem;
            height: 1px;
            // border-bottom: 1px solid var(--font-color);
            // margin: 0.75rem 0;
            background: var(--font-color);
            opacity: 0.25;
          }

          .rd-data {
            position: relative;
            width: 100%;
            height: 0.4rem;
            // margin-bottom: 0.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .rd-name {
              position: relative;
              line-height: 1;
              color: var(--text-color);
            }

            .rd-total-count {
              position: relative;
              line-height: 1;
              color: var(--text-color);
            }

            &:last-child {
              margin: 0;
            }
          }
        }

        .rd-panel-divider {
          position: relative;
          // left: 0.1rem;
          width: 10rem;
          height: 1px;
          margin: 0.75rem 0;
          background: var(--font-color);
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
